import sys
import time
import requests
from elasticsearch import exceptions, Elasticsearch
import logging

es = Elasticsearch(host='es')

logger = logging.getLogger("CibusCartLogger")



class CibusFactory(object):
    """
    Factory class that will handle data logic in application.
    Each module will have its own model layer which will inherit from this factory method
    This factory method will have access to the datastore, be it NoSQL implementation or
    from SQL datastores, the database will not matter to the individual module implementaions
    """


class CibusElasticSearch(object):
    """
    Elastic search implementation
    """

    def check_and_load_index(self):
        """
        Check and load the index from elastic search
        """
        if not self.safe_check_index('cibusdata'):
            logger.info("Index not found")
            self.load_data_in_es()

    def safe_check_index(self, index, retry=3):
        """
        Connects to ES with a retry, if the retry fails
        :param index: Index to check
        :param retry: retry count, default is 3
        :return:
        """
        if not retry:
            logger.error("Out of retries. Bailing out...")
            sys.exit(1)
        try:
            status = es.indices.exists(index)
            return status
        except exceptions.ConnectionError as e:
            logger.error("Unable to connect to ES. Retrying in 5 secs...")
            time.sleep(5)
            self.safe_check_index(index, retry - 1)

    @staticmethod
    def load_data_in_es():
        """
        creates an index in elasticsearch
        """
        url = "http://data.sfgov.org/resource/rqzj-sfat.json"
        r = requests.get(url)
        data = r.json()
        logger.info("Loading data in elasticsearch ...")
        for id, truck in enumerate(data):
            res = es.index(index="cibusdata", doc_type="truck", id=id, body=truck)
        logger.info("Total trucks loaded: {}".format(len(data)))
